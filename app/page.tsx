import Image from "next/image";
import Lanyard from "./components/Lanyard/Lanyard";

export default function Home() {
	return (
        <div className="min-h-screen overflow-x-hidden">
            <div className="container border mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-6 bg-red-500">A</div>
                    <div className="col-span-6 bg-blue-500">
                        <Lanyard />
                    </div>
                </div>
            </div>
        </div>
	);
}
