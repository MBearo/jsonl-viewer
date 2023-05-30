import {useMemo} from 'react';
import styled from '@emotion/styled';
import {Source} from '@otakustay/react-source-view';
import {tokenize, TokenizeOptions} from '@otakustay/source-tokenizer';
import {refractor} from 'refractor';
import {getIcon} from 'material-file-icons';
import '@otakustay/react-source-view/style/index.css';
import 'prism-color-variables/variables.css';
import 'prism-color-variables/themes/duracula.css';
import {useMarkdownConfig} from './MarkdownConfigProvider';
import {CopyCode} from './CopyCode';
import {sampleFileNameFromLanguage} from './language';

interface LanguageTypeIconProps {
    language: string;
}

function LanguageTypeIcon({language}: LanguageTypeIconProps) {
    const icon = getIcon(sampleFileNameFromLanguage(language));

    // bca-disable-line
    return <i style={{width: 14, height: 14}} dangerouslySetInnerHTML={{__html: icon.svg}} />;
}

const Header = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    padding: 0 12px;
    background-color: #343540;
`;

const Layout = styled.div`
    --source-text-color: #f8f8f3;
    --source-background-color: #000;

    margin: 0;
    font-size: 12px;
    background-color: var(--source-background-color);
    color: var(--source-text-color);
    border-radius: 4px;
    overflow: hidden;
`;

const SourceCode = styled(Source)`
    border: 1em solid transparent;
`;

interface Props {
    inline: boolean;
    className?: string;
    children: string[];
}

export default function CodeBlock({inline, className, children}: Props) {
    const {codeHighlight} = useMarkdownConfig();
    const code = useMemo(
        () => children.join('\n').trim(),
        [children]
    );
    const language = useMemo(
        () => /language-(\w+)/.exec(className || '')?.[1],
        [className]
    );
    const syntax = useMemo(
        () => {
            if (!codeHighlight || !language || !refractor.registered(language)) {
                return undefined;
            }

            const options: TokenizeOptions = {
                highlight: source => refractor.highlight(source, language),
            };
            return tokenize(code, options);
        },
        [codeHighlight, language, code]
    );

    if (inline) {
        return <code className={className}>{children}</code>;
    }

    return (
        <Layout>
            <Header>
                <LanguageTypeIcon language={language ?? ''} />
                {language}
                <CopyCode text={code + '\n'} />
            </Header>
            <SourceCode source={code} syntax={syntax} />
        </Layout>
    );
}