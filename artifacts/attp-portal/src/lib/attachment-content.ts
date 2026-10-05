const DATABASE_NAME = "attp-registration-attachment-content";
const DATABASE_VERSION = 1;
const STORE_NAME = "files";

let databasePromise: Promise<IDBDatabase> | undefined;

const openDatabase = () => {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is unavailable in this browser."));
  }

  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("Could not open attachment storage."));
      request.onblocked = () =>
        reject(new Error("Attachment storage is blocked by another tab."));
    }).catch((error: unknown) => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
};

export async function saveAttachmentContent(key: string, file: Blob) {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(file, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("Could not save attachment."));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Saving the attachment was aborted."));
  });
}

export async function readAttachmentContent(key: string) {
  const database = await openDatabase();

  return new Promise<Blob | undefined>((resolve, reject) => {
    const request = database
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .get(key);
    request.onsuccess = () =>
      resolve(request.result instanceof Blob ? request.result : undefined);
    request.onerror = () =>
      reject(request.error ?? new Error("Could not read attachment."));
  });
}

export async function deleteAttachmentContent(key: string) {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("Could not delete attachment."));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Deleting the attachment was aborted."));
  });
}
