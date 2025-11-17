import CheckAdmin from "@/src/admin_components/CheckAdmin";
import Footer from "@/src/components/Footer";

export default function Admin() {
    return (
        <CheckAdmin load={ true }>
            <section className="animate-[fade-in_.3s] mt-[90px] md:mt-[110px]">
                <div className="flex flex-col items-center">
                    <h1 className="text-[3rem]">Admin</h1>
                </div>
            </section>
        </CheckAdmin>
    );
}