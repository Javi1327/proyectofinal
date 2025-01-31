import "./Footer.css"

const Footer = () =>{
    return (
        <div>
            <footer className="footer">
                <div className="footer-row">                   
                    <div className="footer-links">
                        <h4>Informacion</h4>
                        <p>Docentes y Especialistas en industria<br/>capacitando hace mas de 10 años.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Contactanos</h4>
                        <ul>
                            <li><p>Teléfono : +54 9 11 2834 8315</p></li>
                            <li><p>E-mail : consultas@edutech.email</p></li>
                        </ul>
                    </div>
                </div>
             <p className="copy">todos los derechos reservados </p>

            </footer>             
        </div>
    ) 
}

export default Footer