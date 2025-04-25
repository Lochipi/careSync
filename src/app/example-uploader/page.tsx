"use client";

import { useState } from "react";
import { UploadButton } from "~/utils/uploadthing";
import Image from "next/image";

export default function Home() {
    const [imageUrl, setimageUrl] = useState<string>("");
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => { 
                    setimageUrl(res[0]?.ufsUrl ?? "");
                    console.log("Files: ", res);
                    alert("Upload Completed");
                }}
                onUploadError={(error: Error) => { 
                    alert(`ERROR! ${error.message}`);
                }}
            />

            {imageUrl.length ? (
                <div>
                    <h2>Image Preview</h2>
                    <Image src={imageUrl} alt="Uploaded Image" width={500} height={300} />
                </div>
            ) : 'nothing here, no image uploaded yet'}
        </main>
    );
}
