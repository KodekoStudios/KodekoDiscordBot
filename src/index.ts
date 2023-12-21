import {
  GatewayIntentBits,
  InteractionType,
  InteractionResponseType,
  type APIInteraction,
  type APIGuild
} from '@biscuitland/common'
import { values, isNil } from 'lodash'
import Client from '@struct/client'
import { inspect } from 'util'

const AsyncFunction = async function () {
  return null
}.constructor

void (async function main () {
  const client = new Client({
    intents: GatewayIntentBits.GuildMessages,
    token:
      'MTEyMDg3NzkzNzc2NDM0ODAwNA.Gi2UYi.ZRtetnSuDfWMImwCv_q_dXbJGVzCYYpJ65SN-M'
  })

  client.once('READY', async payload => {
    const username = payload.user.username

    console.log('Logged in as: %s', username)
  })

  client.on('INTERACTION_CREATE', async interaction => {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        if (
          isNil((interaction as APIInteraction & { guild: APIGuild }).guild)
        ) {
          return await client.managers.interactions.reply(
            interaction.id,
            interaction.token,
            {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content:
                  "[Error]: You can't run commands on my direct messages!"
              }
            }
          )
        }
        await client.manager.call_commands(client, interaction)
        break
    }
  })

  client.on('MESSAGE_CREATE', async msg => {
    if (msg.author.bot ?? false) return

    const messageReference = {
      guild_id: msg.guild_id ?? undefined,
      channel_id: msg.channel_id,
      message_id: msg.id
    }

    if (
      values(client.developers).some(x => x.id === msg.author.id) &&
      msg.content.startsWith('.')
    ) {
      if (msg.content.startsWith('.eval')) {
        const depth = msg.content.matchAll(/-d=(\d+|null)/g).next().value?.[1]
        const code = msg.content
          .slice(5)
          .replace(/-d=(\d+|null)/g, '')
          .trim()
        const result = AsyncFunction('msg', `"use strict";\n${code}`).bind(
          client,
          msg
        )
        try {
          await client.managers.channels.createMessage(msg.channel_id, {
            content: `\`\`\`js\n${inspect(
              await result().catch((e: Error) => e.stack),
              {
                depth: depth === 'null' ? null : Number(depth) ?? undefined
              }
            ).slice(0, 1900)}\`\`\``,
            message_reference: messageReference
          })
        } catch (error) {
          await client.managers.channels.createMessage(msg.channel_id, {
            content: `\`\`\`${(error as Error).message}\`\`\``,
            message_reference: messageReference
          })
        }
      }
    }
  })

  await client.init()
})()
