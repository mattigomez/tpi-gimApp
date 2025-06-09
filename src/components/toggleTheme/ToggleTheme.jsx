import { useContext } from "react"
import { Button } from "react-bootstrap"
import { ThemeContext } from "../../services/theme/theme.context.jsx"
import { THEMES } from "../../services/theme/ThemeContextProvider.consts.js"
import { Moon, Sun } from "react-bootstrap-icons"

const ToggleTheme = () => {
    const { theme, toggleTheme } = useContext(ThemeContext)

    return (
        <Button onClick={toggleTheme} variant="outline-light" className="me-3 my-3">
            {theme === THEMES.LIGHT ? <Moon /> : <Sun />}
        </Button>
    )
}

export default ToggleTheme