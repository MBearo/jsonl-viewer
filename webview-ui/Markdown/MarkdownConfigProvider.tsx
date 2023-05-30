import { ReactNode, createContext, useContext, useMemo } from 'react';

interface ContextValue {
    codeHighlight: boolean;
}

const Context = createContext<ContextValue>({ codeHighlight: false });
Context.displayName = 'MarkdownConfigProvider';

interface Props {
    codeHighlight?: boolean;
    children: ReactNode;
}

export default function MarkdownConfigProvider({ codeHighlight, children }: Props) {
    const value = useMemo((): ContextValue => {
        return { codeHighlight: codeHighlight ?? false };
    }, [codeHighlight]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMarkdownConfig() {
    return useContext(Context);
}
