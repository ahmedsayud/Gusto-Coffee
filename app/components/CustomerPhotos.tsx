"use client";

import { useState, useEffect } from "react";
import { Camera, Heart } from "lucide-react";
import { getDbData } from "../actions/db";

export default function CustomerPhotos() {
  const [likesState, setLikesState] = useState<Record<number, { count: number; liked: boolean }>>({});
  const [photosData, setPhotosData] = useState<any[]>([]);

  useEffect(() => {
    getDbData().then((data: any) => {
      if (data.photos) {
        setPhotosData(data.photos);
        const savedLikes = localStorage.getItem("photoLikes");
        if (savedLikes) {
          setLikesState(JSON.parse(savedLikes));
        } else {
          const initialState: Record<number, { count: number; liked: boolean }> = {};
          data.photos.forEach((photo: any) => {
            initialState[photo.id] = { count: photo.initialLikes || 0, liked: false };
          });
          setLikesState(initialState);
        }
      }
    });
  }, []);

  const handleLike = (id: number) => {
    setLikesState((prev) => {
      const current = prev[id] || { count: 0, liked: false };
      const newState = {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked,
        },
      };
      localStorage.setItem("photoLikes", JSON.stringify(newState));
      return newState;
    });
  };

  if (photosData.length === 0) return null;

  return (
    <section className="relative z-20 mx-auto max-w-[1400px] px-6 pb-20 lg:pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-1.5 text-[10px] font-bold text-stone-500 mb-4 uppercase tracking-[0.2em]">
            <Camera size={14} />
            <span>#CustoCoffeeMoments</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-stone-900">شاركنا لحظتك</h2>
        </div>
        <p className="text-stone-500 font-medium max-w-md">أجمل لحظات عشاق قهوتنا حول العالم. التقط صورتك وشاركها معنا لتنضم لعائلتنا.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {photosData.map((photo, idx) => {
          const photoState = likesState[photo.id] || { count: photo.initialLikes || 0, liked: false };
          
          return (
            <div key={photo.id} className={`group relative overflow-hidden rounded-[24px] bg-stone-900 aspect-square ${idx === 0 || idx === 3 ? 'md:mt-8' : ''}`}>
              <img src={photo.url} alt="Customer Coffee Moment" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-8">
                <button 
                  onClick={() => handleLike(photo.id)}
                  className={`transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 font-bold px-4 py-2 rounded-full border shadow-lg hover:scale-105 active:scale-95 ${
                    photoState.liked 
                      ? 'bg-white text-red-500 border-white' 
                      : 'bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30'
                  }`}
                >
                  <Heart size={18} className={photoState.liked ? "fill-red-500 text-red-500" : "fill-transparent text-white"} />
                  <span>{photoState.count}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
