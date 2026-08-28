'use client';

import { useEffect, useState } from "react";
import Image from 'next/image';

import akaraImg from '@/public/images/akara.jpg';
import egusiSoupImg from '@/public/images/egusi-soup.jpg';
import jollofRiceImg from '@/public/images/jollof-rice.jpg';
import moiMoiImg from '@/public/images/moi-moi.jpg';
import pepperSoupImg from '@/public/images/pepper-soup.jpg';
import puffPuffImg from '@/public/images/puff-puff.jpg';
import suyaImg from '@/public/images/suya.jpg';
import styles from './image-slideshow.module.css';


const images = [
  { image: akaraImg, alt: 'A delicious, bean-cake' },
  { image: egusiSoupImg, alt: 'A delicious, melon-soup' },
  { image: jollofRiceImg, alt: 'A delicious, Nigerian Jollof-rice' },
  { image: moiMoiImg, alt: 'A delicious, steamed bean pudding' },
  { image: pepperSoupImg, alt: 'A delicious, African pepper soup' },
  { image: puffPuffImg, alt: 'A delicious, fried sweet dough balls' },
  { image: suyaImg, alt: 'A delicious, spicy grilled meat skewers' },

];


export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <div className={styles.slideshow}>
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.image}
            className={index === currentImageIndex ? styles.active : styles.image}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        ))}
      </div>
    </>
  );
}