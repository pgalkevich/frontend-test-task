import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Store from "../../store/store";
import {observer} from "mobx-react";
import {Loader} from "../Loader/Loader";
import {Row} from "../Row/Row";


export const History = observer(() => {
    let store = Store;
    const {groupedEvents} = store;
    const groups = Object.keys(groupedEvents || {});
    const [displayedItems, setDisplayedItems] = useState(100);
    const [stopRender, setStopRender] = useState(false);

    const handleScrollEvent = useCallback((e) => {
        const docHeight = e.target.documentElement.scrollHeight;
        const scrolledValue = e.target.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        if (stopRender) {
            return;
        }

        if (docHeight - (windowHeight + scrolledValue) < 100) {
            setDisplayedItems((prevCount) => prevCount + 100);
        }
    }, [stopRender]);

    useEffect(() => {
        document.addEventListener('scroll', handleScrollEvent);
        return () => {
            store = null;
            document.removeEventListener('scroll', handleScrollEvent);
        }
    }, [displayedItems]);

    useEffect(() => {
        if (!!store && !!store.events && (store.events.length <= displayedItems)) {
            setStopRender(true);
        }
    }, [displayedItems, store.events, store]);

    const renderRows = useMemo(() => {
        let localCount = 1;
        const elements = [];

        for (let group of groups) {
            if (localCount === displayedItems) {
                break;
            }

            elements.push(<div key={group} className={'event-group'}>
                {
                    groupedEvents[group]
                        .map((evt, i) =>  {
                            if (localCount === displayedItems) {
                                return null;
                            }
                            localCount++;
                            return <Row
                                key={evt.id}
                                eventType={!i ? evt.resource : ''}
                                details={
                                    store.resources && store.resources[`${evt.resource}/${evt.id}`].details
                                }
                                code={
                                    store.resources && store.resources[`${evt.resource}/${evt.id}`].values &&
                                    store.resources[`${evt.resource}/${evt.id}`].values.join(', ')}
                                date={evt.date}
                            />;
                        })
                }
            </div>);
        }

        return elements;
    }, [displayedItems, groupedEvents, store.resources]);


    return (
        <div>
            {store.loading && <Loader />}
            {!!store.events && (
                <>
                    <div className={'event-group'}>
                        <Row header />
                    </div>
                    {renderRows}
                </>
            )}
        </div>
    );
});

