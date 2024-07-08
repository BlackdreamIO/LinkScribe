
export const ConditionalRender = ({ render, children }: { render: boolean, children: React.ReactNode }) => {
    return <>{render ? children : null}</>;
}