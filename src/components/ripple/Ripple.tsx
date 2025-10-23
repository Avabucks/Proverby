import "./Ripple.css";

interface RippleProps {
  children: React.ReactNode;
  icon?: string;
}

export default function Ripple({ children, icon }: RippleProps) {
  return (
        <div className="ripple"><i className={`${ icon }`}></i>{ children }</div>
    );
}