import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import {
  BlogsIcon,
  CelebrateIcon,
  GuideIcon,
  SeparatorLine,
  SignOutIcon,
} from "../assets/images";
import Terminal from "../components/Terminal"

interface ILink {
  name: string;
  onClick: () => void;
  icon: string;
}

export default function SuccessView(props: { userId: string }) {
  let userId = props.userId;

  const navigate = useNavigate();

  async function logoutClicked() {
    await signOut();
    navigate("/auth");
  }

  function openLink(url: string) {
    window.open(url, "_blank");
  }

  const links: ILink[] = [
    {
      name: "Sign Out",
      onClick: logoutClicked,
      icon: SignOutIcon,
    },
  ];

  return (
    <>
      <div className="main-container">
        <Terminal></Terminal>
      </div>

      <div className="bottom-links-container">
        {links.map((link) => (
          <div className="link" key={link.name}>
            <img className="link-icon" src={link.icon} alt={link.name} />
            <div role={"button"} onClick={link.onClick}>
              {link.name}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
