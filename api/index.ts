// import path from "path";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./modules/user/Auth.resolver";
import { UserAvatarResolver } from "./modules/user/UserAvatar.resolver";
import { UserBuildResolver } from "./modules/user/UserBuild.resolver";
import { UserWeaponResolver } from "./modules/user/UserWeapon.resolver";

export const createSchema = () =>
  buildSchema({
    resolvers: [AuthResolver, UserAvatarResolver, UserWeaponResolver, UserBuildResolver],
    authChecker: ({ context: { user } }, roles) => {
      if (user) return roles?.length ? roles.includes(user.type) : !!user.uid;
      return false;
    },
  });
