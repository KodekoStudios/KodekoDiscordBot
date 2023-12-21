import {
  type APIApplicationCommandInteraction,
  MessageFlags,
  Collection,
  ApplicationCommandOptionType,
  InteractionResponseType
} from '@biscuitland/common'

import { AbstractCommand, type BaseCommand } from './command'

import { is_extending_to } from '@util/is_extending_to'
import { get_files } from '@util/get_files'

import { cwd } from 'process'
import type Client from './client'

export default class CommandManager {
  // Array to store registered commands
  static commands = new Collection<string, AbstractCommand>()

  static get command_count (): number {
    return this.commands
      .map(
        el =>
          el.data.data.options?.filter(
            s => s.type === ApplicationCommandOptionType.Subcommand
          )?.length != null || 1
      )
      .reduce((r, t) => r + (t as number), 0)
  }

  /**
   * Calls the appropriate command based on the name of the interaction.
   * @param client - The client instance.
   * @param interaction - The command interaction object.
   */
  static async call_commands (
    client: Client,
    interaction: APIApplicationCommandInteraction
  ): Promise<any> {
    const command = this.commands.get(interaction.data.name)
    if (command != null) {
      try {
        await command.run.call(client, interaction)
      } catch (error: unknown) {
        await client.managers.interactions
          .reply(interaction.id, interaction.token, {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: `**Error!**\n\n\`\`\`\n${(error as Error).stack}\`\`\``,
              flags: MessageFlags.Ephemeral
            }
          })
          .catch(async () => {
            await client.managers.interactions
              .reply(interaction.id, interaction.token, {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                  content: `**Error!**\n\n\`\`\`\n${
                    (error as Error).stack
                  }\`\`\``,
                  flags: MessageFlags.Ephemeral
                }
              })
              .catch()
          })
      }
    } else {
      await client.managers.interactions.reply(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: '[Error]: Failed to run the command!',
            flags: MessageFlags.Ephemeral
          }
        }
      )
    }
  }

  /**
   * Loads the commands and components from their respective files.
   */
  static async load (): Promise<any> {
    this.commands = new Collection()

    // Get all command and component files
    const filesCommands = get_files(cwd().concat('/src/commands/')).filter(el =>
      el.name.endsWith('.ts')
    )

    // Load and validate commands
    for (const file of filesCommands) {
      const Command = (await import(file.name)) as {
        default: typeof BaseCommand
      }

      try {
        // Check if the command extends the AbstractCommand class
        if (is_extending_to(Command.default, AbstractCommand)) {
          // eslint-disable-next-line new-cap
          const cmd = new Command.default()
          this.commands.set(cmd.data.data.name ?? '', cmd)
        }
      } catch {
        throw new Error(`[Error]: Invalid export in ${file.name}!`)
      }
    }
  }

  /**
   * Syncs the commands with the application on Discord.
   * @param client - The client instance.
   */
  static async sync (client: Client): Promise<undefined> {
    const globalCommands = this.commands.map(el => el.data.toJSON())

    // Bulk commands
    await client.managers.applications.bulkGuildCommands(
      client.applicationId,
      client.kodekoId,
      globalCommands
    )
  }
}
