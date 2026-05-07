"use server";

import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function getDbData() {
  try {
    const fileContents = await fs.readFile(dbPath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { categories: [], photos: [] };
  }
}

export async function saveCategory(category: any) {
  const data = await getDbData();
  const existingIndex = data.categories.findIndex((c: any) => c.id === category.id);
  
  if (existingIndex > -1) {
    data.categories[existingIndex] = category;
  } else {
    data.categories.push(category);
  }
  
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  return { success: true };
}

export async function deleteCategory(id: string) {
  const data = await getDbData();
  data.categories = data.categories.filter((c: any) => c.id !== id);
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  return { success: true };
}

export async function savePhoto(photo: any) {
  const data = await getDbData();
  const existingIndex = data.photos.findIndex((p: any) => p.id === photo.id);
  
  if (existingIndex > -1) {
    data.photos[existingIndex] = photo;
  } else {
    data.photos.push(photo);
  }
  
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  return { success: true };
}

export async function deletePhoto(id: number) {
  const data = await getDbData();
  data.photos = data.photos.filter((p: any) => p.id !== id);
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  return { success: true };
}
