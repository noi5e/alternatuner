import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router";

import { useAuthClaims, signOut } from "../features/auth/useAuthClaims";

export function SiteNav() {
  const { claims, loading } = useAuthClaims();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/">alternaTuner</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {!loading && !claims && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/login">Login</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {!loading && claims && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
