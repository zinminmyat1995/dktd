export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="DKTD Logo"
            className={className}
        />
    );
}