"use client";
import Ripple from "@/src/components/Ripple";
import { deleteProverbio } from "@/src/actions/proverbi_actions";

interface DeletePopupProps {
  setOpenDeletePopup: Function;
  id: number;
}

export default function DeletePopup({ setOpenDeletePopup, id }: DeletePopupProps) {

  async function handleDelete() {
    const result = await deleteProverbio(id)
    if (result) {
      setOpenDeletePopup(false)
    }
  };

  return (
    <div>
      <p>Sei sicuro di voler eliminare il proverbio? L’operazione sarà irreversibile.</p>
      <div className="flex items-center justify-end gap-[10px]">
        <Ripple opt="outline" icon="bx bx-x" handleOnClick={() => setOpenDeletePopup(false)}>Annulla</Ripple>
        <Ripple opt="delete" icon="bx bx-trash" handleOnClick={handleDelete}>Elimina</Ripple>
      </div>
    </div>
  );
}