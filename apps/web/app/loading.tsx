// export default function Loading() {
//     return (
//         <div className="flex min-h-screen items-center justify-center">
//             <div className="flex flex-col items-center gap-4">
//                 <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
//                 <p className="text-sm text-muted-foreground">Loading...</p>
//             </div>
//         </div>
//     );
// }


// export default function loading(){
//     const loadingContainerStyle={
//         display : 'flex',
//         minHeight : '100vh',
//         alignItems : 'center',
//         justifyContent : 'center'
//     };
//     const contentStyle={
//         display : 'flex',
//         flexDirection : 'column',
//         alignItems : 'center',
//         gap : '1rem'
//     };
//     const spinnerStyle={
//         height :'3rem',
//         width:"3rem",
//         borderRadius :'9999px',
//         border:'4px solid rgb(34,197,94)',
//         borderColor :'transparent'
//     };

//     return (
//         <div style={loadingContainerStyle}>
//             <div style={contentStyle}>
//                 <div style={spinnerStyle} className="animate-spin"></div>
//                 <p className="text-sm text-muted-foreground">Loading...</p>
//             </div>
//             </div>
//     );

// }


// meathod :2   this is for learning curve

// export default function Loading() {
//     const loadingContainerStyle = {
//         display: 'flex',
//         minHeight: '100vh',
//         alignItems: 'center',
//         justifyContent: 'center'
//     };

//     const contentStyle = {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: '1rem'
//     };

//     const spinnerStyle = {
//         height: '3rem',
//         width: '3rem',
//         borderRadius: '9999px',
//         border: '4px solid rgb(34, 197, 94)',
//         borderTopColor: 'transparent'
//     };

//     return (
//         <div style={loadingContainerStyle}>
//             <div style={contentStyle}>
//                 <div style={spinnerStyle} className="animate-spin" />
//                 <p className="text-sm text-muted-foreground">Loading...</p>
//             </div>
//         </div>
//     );
// }

// this is the most best method ut in next and react frame works i personally used it 

export default function Loading() {
    return (
        <>
            <style>{`
                .loading-container {
                    display: flex;
                    min-height: 100vh;
                    align-items: center;
                    justify-content: center;
                }
                .spinner {
                    height: 3rem;
                    width: 3rem;
                    animation: spin 1s linear infinite;
                    border-radius: 9999px;
                    border: 4px solid rgb(34, 197, 94);
                    border-top-color: transparent;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            
            <div className="loading-container">
                <div className="flex flex-col items-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        </>
    );
}
