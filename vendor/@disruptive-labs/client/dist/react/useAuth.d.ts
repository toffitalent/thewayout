import type { Client as ClientType } from '../client';
import { AuthContextType } from './AuthContext';
export declare function useAuth<Client extends ClientType<any, any, any> = ClientType>(): AuthContextType<Client>;
export declare function useClient<Client extends ClientType<any, any, any> = ClientType>(): Client;
