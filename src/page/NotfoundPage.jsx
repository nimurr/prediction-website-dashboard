const NotfoundPage = () => {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#f9fafb",
                fontFamily: "sans-serif",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <h1
                style={{
                    fontSize: "6rem",
                    fontWeight: "bold",
                    color: "#2563eb",
                    margin: "0",
                }}
            >
                404
            </h1>
            <h2 style={{ fontSize: "2rem", marginBottom: "10px", color: "#1f2937" }}>
                Page Not Found
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#6b7280", marginBottom: "20px" }}>
                Oops! The page you’re looking for doesn’t exist or has been moved.
            </p>
            <a
                href="/"
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "500",
                    transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
                Go Home
            </a>
        </div>
    );
};

export default NotfoundPage;
