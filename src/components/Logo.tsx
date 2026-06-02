import React from "react";

export default function Logo({ className = "w-9 h-9" }: { className?: string }) {
  // Use lh3.googleusercontent.com/d/[ID] which is highly reliable for embedding Drive images
  // falling back to thumbnail format if it fails.
  const [imgSrc, setImgSrc] = React.useState(
    "https://lh3.googleusercontent.com/d/1HiPzgUH3RlZP6oL3NK-PMKvJdtavPvZa"
  );

  const handleError = () => {
    // If the main link fails, fallback to the thumbnail proxy which works nicely in iframe settings
    if (imgSrc !== "https://drive.google.com/thumbnail?id=1HiPzgUH3RlZP6oL3NK-PMKvJdtavPvZa&sz=w300") {
      setImgSrc("https://drive.google.com/thumbnail?id=1HiPzgUH3RlZP6oL3NK-PMKvJdtavPvZa&sz=w300");
    }
  };

  return (
    <img 
      src={imgSrc}
      className={`${className} object-contain`}
      alt="Logo"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}
