import { SlashCommand } from '@biscuitland/helpers'
import { type APIInteraction } from '@biscuitland/common'
import type Client from './client'

/**
 * Abstract base class for commands.
 */
export abstract class AbstractCommand {
  /**
   * Slash data from builder.
   */
  abstract data: SlashCommand

  /**
   * The main logic for executing the command.
   * @param interaction - The interaction object representing the command.
   * @returns A promise that resolves to the result of the command execution.
   */
  abstract run (
    this: Client,
    interaction: APIInteraction
  ): ProbablyPromise<unknown>
}

/**
 * Default implementation of the base command.
 */
export class BaseCommand extends AbstractCommand {
  data = new SlashCommand()
    .setName('unknown')
    .setDesciption("This command doesn't have a description.")

  /**
   * Throws an error indicating that the command is empty.
   */
  run (): undefined {
    throw new Error('EMPTY COMMAND')
  }
}
