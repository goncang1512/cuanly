export const getSrc = ({
  avatar,
  avatarId,
  image,
}: {
  avatar: string;
  avatarId: string;
  image: string | null;
}) => {
  return avatarId === "default" ? image || `/${avatar}` : avatar;
};
