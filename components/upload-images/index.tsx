import axios from "axios";
import { Dispatch, SetStateAction } from "react";

const preset_key = "nysiszic";
const cloud_name = "dckx8pbkt";

export async function uploadImages(
  event: React.ChangeEvent<HTMLInputElement>,
  handleValue: (value: string) => void,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  const file = event.target.files?.[0];

  if (!file) {
    throw new Error("Nenhum arquivo selecionado.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset_key);
  try {
    setLoading(true);
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData
    );
    handleValue(response.data.secure_url);
  } catch (err) {
    console.error(err);
    throw new Error("Ocorreu um erro ao fazer o upload do arquivo.");
  } finally {
    setLoading(false);
  }
}
