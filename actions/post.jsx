'use server';

import { uploadImage } from "@/lib/cloudinary";
import { deleteMeal, storeMeal, updateMeal } from "@/lib/meals";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import xss from "xss";
import { toggleLike } from "@/lib/likes";
import { addComment, updateComment, deleteComment } from "@/lib/comments";
import { hashPassword, verifyPassword } from "@/lib/hash";
import { getUserByUsername, getUserByEmail, createUser } from "@/lib/users";
import { createAuthSession, destroySession, verifyAuth } from "@/lib/auth";
import { updateUserProfile, updateUserPassword, getUserById } from "@/lib/users";




export async function sharePost(prevState, formData) {
  const { user } = await verifyAuth();

  if (!user) {
    return { errors: ['You must be logged in to share a meal.'] };
  }


  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  let errors = [];

  if (!meal.title || meal.title.trim().length === 0) {
    errors.push("Title is required.");
  }

  if (!meal.summary || meal.summary.trim().length === 0) {
    errors.push("Summary is required.");
  }

  if (!meal.instructions || meal.instructions.trim().length === 0) {
    errors.push("Instruction is required.");
  }

  if (!meal.image || meal.image.size === 0) {
    errors.push("Image is required.");
  }

  if (!meal.creator || meal.creator.trim().length === 0) {
    errors.push("Name is required.");
  }

  if (!meal.creator_email || !meal.creator_email.includes('@')) {
    errors.push("Please enter a valid email address.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(meal.image);
  } catch (error) {
    throw new Error(
      'Image upload failed, post was not created. Please try again later.'
    );
  }

  try {
    await storeMeal({
      slug: slugify(meal.title, { lower: true }),
      title: meal.title,
      summary: meal.summary,
      instructions: xss(meal.instructions),
      image: imageUrl,
      creator: meal.creator,
      creator_email: meal.creator_email,
      userId: user.id,
    });
  } catch (error) {
    console.error('storeMeal failed:', error);
    throw new Error(
      'Storage failed, post was not stored. Please try again later.'
    );
  }

  revalidatePath('/meals');
  revalidatePath('/');
  redirect("/meals");
}


export async function toggleMealLike(mealId) {
  const { user } = await verifyAuth();

  if (!user) {
    return;
  }


  toggleLike(mealId, user.id);
  revalidatePath('/');
  revalidatePath('/meals');
  revalidatePath(`/meals/[meal]`, 'page');
}


export async function postComment(prevState, formData) {
  const { user } = await verifyAuth();

  if (!user) {
    return { error: 'You must be logged in to comment.' };
  }

  const mealId = formData.get('mealId');
  const content = formData.get('content');
  const parentId = formData.get('parentId') || null;

  console.log('DEBUG postComment:', { mealId, userId: user.id, parentId, content });

  if (!content || content.trim().length === 0) {
    return { error: 'Comment cannot be empty.' };
  }

  addComment(mealId, user.id, xss(content), parentId);

  revalidatePath('/meals/[meal]', 'page');

  return { error: null };
}


export async function editComment(prevState, formData) {
  const { user } = await verifyAuth();

  if (!user) {
    return { error: 'You must be logged in to edit a comment.', success: false };
  }

  const commentId = formData.get('commentId');
  const content = formData.get('content');

  if (!content || content.trim().length === 0) {
    return { error: 'Comment cannot be empty.', success: false };
  }

  const result = updateComment(commentId, user.id, xss(content));

  if (result.changes === 0) {
    return { error: 'You can only edit your own comments.', success: false };
  }

  revalidatePath('/meals/[meal]', 'page');

  return { error: null, success: true };
}


export async function removeComment(commentId) {
  const { user } = await verifyAuth();

  if (!user) {
    return;
  }


  deleteComment(commentId, user.id);
  revalidatePath('/meals/[meal]', 'page');
}

export async function signup(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');

  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters.');
  }

  if (!email || !email.includes('@')) {
    errors.push('Please enter a valid email address.');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  if (errors.length > 0) {
    return { errors };
  }

  if (getUserByUsername(username)) {
    return { errors: ['That username is already taken.'] };
  }
  if (getUserByEmail(email)) {
    return { errors: ['An account with that email already exists.'] };
  }

  const passwordHash = await hashPassword(password);

  const userId = createUser({
    username,
    email,
    password_hash: passwordHash,
    first_name: firstName,
    last_name: lastName,
  });

  await createAuthSession(userId);
  redirect('/meals');
}


export async function login(prevState, formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (!username || !password) {
    return { errors: ['Please enter both username and password.'] };
  }

  const user = getUserByUsername(username);

  if (!user || !user.password_hash) {
    return { errors: ['Invalid username or password.'] };
  }

  const validPassword = await verifyPassword(password, user.password_hash);

  if (!validPassword) {
    return { errors: ['Invalid username or password.'] };
  }

  await createAuthSession(user.id);
  redirect('/meals');
}

export async function logout() {
  await destroySession();
  redirect('/login');
}


export async function updateProfile(prevState, formData) {
  const { user } = await verifyAuth();

  if (!user) {
    return { errors: ['You must be logged in.'] };
  }

  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const image = formData.get('image');

  const errors = [];

  if (!firstName || firstName.trim().length === 0) {
    errors.push('Fist name is required');
  }

  if (!lastName || lastName.trim().lngth === 0) {
    errors.push('Last name is required.');
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl = null;

  if (image && image.size > 0) {
    try {
      imageUrl = await uploadImage(image);
    } catch (error) {
      return { errors: ['Photo upload failed. Please try again.'] };
    }
  }

  updateUserProfile(user.id, {
    first_name: firstName,
    last_name: lastName,
    profile_image: imageUrl,
  });

  revalidatePath('/profile');
  redirect("/profile?profileUpdated=1");

  return { errors: null, success: true };
}


export async function changePassword(prevState, formData) {
  const { user } = await verifyAuth();

  if (!user) {
    return { errors: ['You must be logged in.'] };
  }

  const currentPassword = formData.get('currentPassword');
  const newpassword = formData.get('newPassword');
  const confirmPassword = formData.get('confirmPassword');

  const errors = [];

  if (!newpassword || newpassword.length < 8) {
    errors.push('New password must be at least 8 characters.');
  }

  if (newpassword !== confirmPassword) {
    errors.push('New passwords do not match.');
  }

  if (errors.length > 0) {
    return { errors };
  }

  const fullUser = getUserById(user.id);
  const validCurrent = await verifyPassword(currentPassword, fullUser.password_hash);

  if (!validCurrent) {
    return { errors: ['Current password is incorrect.'] };
  }

  const newHash = await hashPassword(newpassword);
  updateUserPassword(user.id, newHash);

  redirect('/profile?passwordChanged=1');

  return { errors: null, success: true };
}


export async function deletePost(mealId) {
  const { user } = await verifyAuth();

  if (!user) {
    return;
  }

  deleteMeal(mealId, user.id);
  revalidatePath('/');
  revalidatePath('/meals');
  revalidatePath('/profile');

  // redirect('/profile?deleted=1');
}


export async function editPost(prevState, formData) {
  const { user } = await verifyAuth();

  if (!user) {
    return { errors: ['You must be logged in.'] };
  }

  const mealId = formData.get('mealId');
  const title = formData.get('title');
  const summary = formData.get('summary');
  const instructions = formData.get('instructions');
  const image = formData.get('image');

  const errors = [];

  if (!title || title.trim().length === 0) errors.push('Title is required.');
  if (!summary || summary.trim().length === 0) errors.push('Summary is required.');
  if (!instructions || instructions.trim().length === 0) errors.push('Instructions are required.');

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl = null;


  if (image && image.size > 0) {
    try {
      imageUrl = await uploadImage(image);
    } catch (error) {
      return { errors: ['Image upload failed. Please try again.'] };
    }
  }

  const result = updateMeal(mealId, user.id, {
    title,
    summary,
    instructions: xss(instructions),
    image: imageUrl,
  });

  if (result.changes === 0) {
    return { errors: ['You can only edit your own meals.'] };
  }

  revalidatePath('/');
  revalidatePath('/meals');
  revalidatePath('/profile');
  revalidatePath('/meals/[meal]', 'page');

  redirect("/profile?updated=1");
}