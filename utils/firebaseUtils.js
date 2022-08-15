import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";

export const handleStoreImageUpload = async (image, directory) => {
  if (image === null) {
    return;
  }
  const imageRef = ref(storage, `${directory}/${image.name + v4()}`);
  const snapshot = await uploadBytes(imageRef, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};
