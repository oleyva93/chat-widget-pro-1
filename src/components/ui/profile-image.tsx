import { useState } from "react";

import { getRandomColor } from '@/lib/random-colors';
import { getInitialFromFullName } from '@/lib/utils';
import type { ProfileImageProps } from '@/types';

export default function ProfileImage({
  profileUrl,
  nickname,
  initials,
  height = 48,
  width = 48,
  fontSize = 16,
}: ProfileImageProps) {
  const [hasError, setHasError] = useState(false);

  function handleError() {
    setHasError(true);
  }

  return (
    <div>
      {hasError || !profileUrl ? (
        <div
          className="bg-gray-200 text-white flex items-center justify-center rounded-full"
          style={{
            width,
            height,
            backgroundColor: getRandomColor(nickname),
            fontSize,
          }}
        >
          {initials ?? getInitialFromFullName(nickname)}
        </div>
      ) : (
        <img
          className="rounded-full object-cover"
          src={profileUrl}
          alt={profileUrl}
          onError={handleError}
          style={{
            width: width,
            height: height,
          }}
        />
      )}
    </div>
  );
}
