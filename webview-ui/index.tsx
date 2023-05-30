import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Markdown from './Markdown';
import styled from '@emotion/styled';

const vscode = acquireVsCodeApi();
function sortArray(arr, keys) {
    if (keys.length === 0) {
        return arr;
    } else {
        return keys;
    }
}
const Tag = styled.div`
    display: inline-block;
    border-radius: 4px;
    background-color: #d9d9d9;
    padding: 4px;
    color: #999;
`;
const Card = styled.div`
    font-size:20px;
`;
const Block = styled.div`
    margin:30px 0;
    display:flex;
    flex-direction:column;
    gap:10px;
`;
const Line = styled.div`
    height:1px;
    background-color:#5a5a5a;
    margin:0px;
`;
async function sleep() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 1000);
    });
}
function App() {
    const [data, setData] = useState<any[][]>([]);
    let config = [];
    useEffect(() => {
        window.addEventListener('message', async event => {
            const message = event.data;
            console.log('message', message.command);
            switch (message.command) {
                case 'content':
                    const list = message.text.split('\n')
                        .map(v => JSON.parse(v || '{}'))
                        .map(v => {
                            return sortArray(Object.keys(v), config.map(v => v.key))
                                .map(vv => {
                                    const item = v[vv];
                                    if (Array.isArray(item) && item.length === 1) {
                                        return {
                                            data: item[0],
                                            type: config.find(vvv => vvv.key === vv)?.type
                                        };
                                    }
                                    return {
                                        data: v[vv],
                                        type: config.find(vvv => vvv.key === vv)?.type
                                    };
                                });
                        });
                    const chunkSize = 10;
                    // const chunks = [];

                    for (let i = 0; i < list.length; i += chunkSize) {
                        const chunk = list.slice(i, i + chunkSize);
                        // setData(chunks => [...chunks, chunk]);
                        // await sleep();
                    }
                    setData(list);
                    break;
                case 'config':
                    console.log(message.text);
                    config = message.text;
                    break;
            }
        });
    }, []);
    return <>
        {
            data.map((item, index) => {
                return (
                    <>
                        <Block key={`${index}`}>
                            {
                                item.map(({ data, type }) => {
                                    if (type === 'tag') {
                                        return (
                                            <div>
                                                <Tag>
                                                    {data}
                                                </Tag>
                                            </div>
                                        );
                                    } else if (type === 'card') {
                                        return (
                                            <Card>
                                                {data}
                                            </Card>
                                        );
                                    } else {
                                        return <Markdown content={data} codeHighlight />;
                                    }
                                })
                            }
                        </Block >
                        <Line></Line>
                    </>
                );
            })
        }
    </>;
}

ReactDOM.render(<App />, document.getElementById('root'));
