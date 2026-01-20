import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { Inventory } from "../domain/types";
import { PRODUCTS } from "../domain/products";

const INVENTORY_DOC = "inventory/current";

function getEmptyInventory(): Inventory {
  const items = Object.fromEntries(PRODUCTS.map((p) => [p.key, 0])) as Inventory["items"];
  return { items };
}

export async function getInventory(): Promise<Inventory> {
  const ref = doc(db, INVENTORY_DOC);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const initial = getEmptyInventory();
    await setDoc(ref, { items: initial.items, updatedAt: serverTimestamp() });
    return initial;
  }

  const data = snap.data() as { items?: Record<string, number> };
  const items = getEmptyInventory().items;

  for (const p of PRODUCTS) {
    const val = data.items?.[p.key];
    items[p.key] = typeof val === "number" ? val : 0;
  }

  return { items };
}

export async function updateInventory(next: Inventory["items"]) {
  const ref = doc(db, INVENTORY_DOC);
  await setDoc(ref, { items: next, updatedAt: serverTimestamp() }, { merge: true });
}
