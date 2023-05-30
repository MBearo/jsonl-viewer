import styled from '@emotion/styled';
import {ComponentType, ReactNode} from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import MarkdownConfigProvider from './MarkdownConfigProvider';

// @ts-expect-error `className`类型不兼容但能用
const MarkdownContent = styled(ReactMarkdown)`
    p {
        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }

    pre {
        margin: 0;
        border: 1em solid transparent;
        font-size: 12px;
        background-color: #000;
        color: #fff;
        border-radius: 4px;
        overflow-x: auto;
    }

    code {
        font-family: monospace;
        padding: 0 .5em;
    }
`;

interface TransparentProps {
    children: ReactNode;
}

function Transparent({children}: TransparentProps) {
    return <>{children}</>;
}

const components: Record<string, ComponentType<any>> = {
    pre: Transparent,
    code: CodeBlock,
};

interface Props {
    content: string;
    codeHighlight: boolean;
}

export default function Markdown({content, codeHighlight}: Props) {
    return (
        <MarkdownConfigProvider codeHighlight={codeHighlight}>
            <MarkdownContent components={components}>
                {content}
            </MarkdownContent>
        </MarkdownConfigProvider>
    );
}