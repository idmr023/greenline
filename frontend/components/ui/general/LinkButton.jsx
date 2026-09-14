import { Link } from "react-router-dom"
import { ArrowRight } from "../../../lib/icons"

export const LinkButton = ({ to, text }) => {
  return (
    <div className="mt-10 text-center">
          <Link to={to} className="inline-block px-8 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-colors" > 
            {text}
            <ArrowRight className="w-4 h-4" />
          </Link>
    </div>
  )
}