import CheckAdmin from "@/src/admin_components/CheckAdmin";
import ListProverbi from "@/src/components/ListProverbi";

export default function Admin() {
    return (
        <CheckAdmin load={true} closeOnError={true}>
            <section className="animate-[fade-in_.3s] mt-[90px] md:mt-[110px]">
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-[2.5rem] font-semibold text-center">Proverbi in revisione</h1>
                    <p className="opacity-40 text-center">Pagina Admin</p>
                    <ListProverbi type="admin"></ListProverbi>
                </div>
            </section>
        </CheckAdmin>
    );
}