import { CHAMP_HONEYPOT } from "../utils/honeypot";
import "../styles/Honeypot.css";

/**
 * Case à cocher invisible servant de piège à robots (honeypot).
 * Un visiteur humain ne la voit jamais et ne peut pas l'atteindre au clavier
 * ni avec un lecteur d'écran : si elle est cochée, la soumission provient d'un
 * automate et l'accès est refusé, côté formulaire comme côté API.
 */
export default function Honeypot({ checked = false, onChange, idSuffixe = "" }) {
  const id = idSuffixe
    ? `confirmation-humaine-${idSuffixe}`
    : "confirmation-humaine";

  return (
    <div className="honeypot" aria-hidden="true">
      <label htmlFor={id}>Ne cochez pas cette case</label>
      <input
        type="checkbox"
        id={id}
        name={CHAMP_HONEYPOT}
        checked={checked}
        onChange={onChange}
        readOnly={typeof onChange !== "function"}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
