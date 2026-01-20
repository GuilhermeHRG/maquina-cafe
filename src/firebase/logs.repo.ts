import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import type { CoffeeLog, CreateCoffeeLogInput } from "../domain/types";

const LOGS = "logs";

export async function createLog(input: CreateCoffeeLogInput) {
  await addDoc(collection(db, LOGS), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

export async function listLogs(lastN = 30): Promise<CoffeeLog[]> {
  const q = query(collection(db, LOGS), orderBy("date", "desc"), limit(lastN));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      date: data.date,
      weekday: data.weekday,
      cleaned: !!data.cleaned,
      cleanedBy: data.cleanedBy ?? "",
      restocked: data.restocked ?? {},
      notes: data.notes,
    };
  });
}
