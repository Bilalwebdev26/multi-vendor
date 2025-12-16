import {kafka} from "@packages/libs/kafka"

const consumer = kafka.consumer({groupId:"user-event-group"})
const eventQueue:any[] = []

