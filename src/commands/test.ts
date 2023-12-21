import {
  type APIInteraction,
  InteractionResponseType
} from '@biscuitland/common'
import { SlashCommand } from '@biscuitland/helpers'
import type Client from '@struct/client'

import { AbstractCommand } from '@struct/command'

export default class Command extends AbstractCommand {
  data = new SlashCommand().setName('test').setDesciption('ol')

  async run (this: Client, interaction: APIInteraction): Promise<any> {
    await this.managers.interactions.reply(interaction.id, interaction.token, {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: 'pong!' }
    })
  }
}
