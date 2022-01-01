import { MessageEvent, MessageChangedEvent } from './message-events.types';

export function isMessageChangedEvent(
  event: MessageEvent,
): event is MessageChangedEvent {
  return (
    event.hasOwnProperty('message') &&
    event.type === 'message' &&
    event.subtype === 'message_changed'
  );
}
