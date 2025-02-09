import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
        <div 
            style={{
                width: "100%",
                padding: 20,
                minHeight: "20vh",
                maxHeight: "30vh",
                marginTop: 50,
            }}
        >
            <p style={{ fontSize: "30px", textAlign:"center", }}>
                This project was created by Pavan Vishnu Sai Bestha. <br />
                <span>
                    <Link style={{ color: "white", textDecoration:"none" }} className='nav-ink' to={"https://www.linkedin.com/in/pavan-vishnu-sai-bestha/"}>
                    LinkedIn</Link>
                </span>
            </p>
        </div>
    </footer>
  )
}

export default Footer