import { Session, type BiscuitOptions } from '@biscuitland/core'
import { type APIUser } from '@biscuitland/common'
import Manager from './manager'
import DataBase from 'collie-db'

export default class Client extends Session {
  /**
   * @public
   * @type {Record<"Pavez" | "Aaron", User>}
   */
  public developers: Record<'Pavez' | 'Aaron', APIUser> = {} as any

  public readonly kodekoId = '1092930557001879552'

  public readonly welcome_channel = '1093679740109467780'

  /**
   * @public
   * @type {Manager}
   */
  public readonly manager: typeof Manager = Manager

  /**
   * @public
   * @type {Database}
   */
  public readonly db: DataBase = new DataBase({
    tables: [{ name: 'users', mod: 'users.json' }]
  })

  constructor (options: BiscuitOptions) {
    super(options)
  }

  public async init (): Promise<void> {
    await this.manager.load()

    await this.db.init()
    await this.start()

    await this.manager.sync(this)

    this.developers.Pavez = await this.managers.users.get('788869971073040454')
    this.developers.Aaron = await this.managers.users.get('852970774067544165')
  }
}
