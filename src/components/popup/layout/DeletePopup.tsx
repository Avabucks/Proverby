"use client";
import Ripple from "@/src/components/ui/Ripple";
import { deleteProverbio } from "@/src/actions/proverbi_actions";
import { BiX, BiTrash } from "react-icons/bi";

interface DeletePopupProps {
  setOpenDeletePopup: Function;
  id: number;
}

export default function DeletePopup({ setOpenDeletePopup, id }: DeletePopupProps) {

  // TODO: toast
  async function handleDelete() {
    const result = await deleteProverbio(id)
    if (result) {
      setOpenDeletePopup(false)
    }
  };

  return (
    <div>
      <p>Sei sicuro di voler eliminare il proverbio? L'operazione sarà irreversibile.</p>
      <div className="mt-5 flex items-center justify-end gap-2.5">
        <Ripple opt="outline" icon={BiX} handleOnClick={() => setOpenDeletePopup(false)}>Annulla</Ripple>
        <Ripple opt="delete" icon={BiTrash} handleOnClick={handleDelete}>Elimina</Ripple>
      </div>
    </div>
  );
}