import Image from "next/image";

interface LoopiAvatarProps {
  size?: "sm" | "md" | "lg";
  showOnline?: boolean;
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

const imageSizeMap = {
  sm: 20,
  md: 24,
  lg: 40,
};

const onlineSizeMap = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

const LoopiAvatar = ({ size = "md", showOnline = true }: LoopiAvatarProps) => {
  return (
    <div className="relative shrink-0">
      <div
        className={`${sizeMap[size]} flex items-center justify-center rounded-full bg-secondary/30 shadow-sm`}
      >
        <Image
          src="/images/loopi-icon.svg"
          alt="Loopi"
          width={imageSizeMap[size]}
          height={imageSizeMap[size]}
        />
      </div>
      {showOnline && (
        <span
          className={`${onlineSizeMap[size]} absolute bottom-0 right-0 rounded-full border-2 border-white bg-emerald-500`}
        />
      )}
    </div>
  );
};

export default LoopiAvatar;
