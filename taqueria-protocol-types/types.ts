// ---- Simple Types & Type Fragments ----

/** @minLength 1 */
export type NonEmptyString = string;

/** @pattern ^[A-Za-z]$ */
export type SingleChar = NonEmptyString;

/** @pattern ^[A-Za-z\-\ ]+ */
export type Verb = NonEmptyString;

export type Alias = (Verb | SingleChar);

/** @pattern ^[A-Za-z]+[A-Za-z0-9-_ ]*$ */
export type HumanReadableIdentifier = NonEmptyString;

export type SanitizedAbsPath = NonEmptyString;

/** @pattern ^(\.\.|\.\/|\/) */
export type SanitizedPath = NonEmptyString;

export type Settings = {
	consent: 'opt_in' | 'opt_out';
};

/**
 * @minimum 1651846877
 * @integer
 */
export type Timestamp = number;

/**
 * @minLength 1
 * @pattern ^\d([\d_]+\d)?$ */
export type Tz = NonEmptyString;

/**
 * @minLength 1
 * @pattern ^\d+\.\d+(\.\d+)*$ */
export type VersionNumber = NonEmptyString;

/** @format url */
export type Url = NonEmptyString;

// ---- Plugin Definition Types ----

/** interpreted using yargs @pattern ^([A-Za-z-_ ]+ ?)((\[.+\] ?)|(\<.+\>) ?)*$ */
export type Command = NonEmptyString;

export type Option = {
	shortFlag?: SingleChar;
	flag: Verb;
	description: NonEmptyString;
	defaultValue?: string | number | boolean;
	type?: 'string' | 'number' | 'boolean';
	required?: boolean;
	boolean?: boolean;
	choices?: NonEmptyString[];
};

export type PositionalArg = {
	placeholder: HumanReadableIdentifier;
	description: NonEmptyString;
	defaultValue?: string | number | boolean;
	type?: 'string' | 'number' | 'boolean';
	required?: boolean;
};

export type InstalledPlugin = {
	type: 'npm' | 'binary' | 'deno';
	name: NonEmptyString;
};

export type Operation = {
	operation: Verb;
	command: Command;
	description?: NonEmptyString;
	positionals?: PositionalArg[];
	options?: Option[];
	handler?: (args: PersistentState) => (args: RequestArgs) => void;
};

export type ParsedOperation = Omit<Operation, 'handler'>;

export type Template = {
	template: Verb;
	command: Command;
	/** @minLength 4 */
	description: NonEmptyString;
	hidden?: boolean;
	options?: Option[];
	positionals?: PositionalArg[];
	handler: TemplateHandler;
	encoding: PluginResponseEncoding;
};

type TemplateHandler =
	| NonEmptyString // TODO: should this be Verb?
	| ((args: RequestArgs) =>
		| void
		| PluginJsonResponse
		| Promise<void>
		| Promise<Promise<void>>
		| Promise<PluginJsonResponse>);

export type ParsedTemplate = Omit<Template, 'handler'> & {
	handler: string;
};

type PluginSchemaBase = {
	name: Alias;
	version: VersionNumber;
	schema: VersionNumber;
	alias: Alias;
	tasks?: Task[];
};

export type PluginInfo = PluginSchemaBase & {
	operations?: ParsedOperation[];
	templates?: ParsedTemplate[];
};

export type PluginSchema = PluginSchemaBase & {
	operations?: Operation[];
	templates?: Template[];
	proxy?: (args: RequestArgs) => Promise<PluginProxyResponse>;
	checkRuntimeDependencies?: (args: RequestArgs) => Promise<PluginDependenciesResponse>;
	installRuntimeDependencies?: (args: RequestArgs) => Promise<PluginDependenciesResponse>;
};

export type Task = {
	task: Verb;
	command: Command;
	aliases?: Alias[];
	/** @minLength 3 */
	description?: NonEmptyString;
	example?: NonEmptyString;
	hidden?: boolean;
	encoding?: PluginResponseEncoding;
	handler: 'proxy' | NonEmptyString;
	options?: Option[];
	positionals?: PositionalArg[];
};

// ---- Process Interop ----

export type RuntimeDependency = {
	name: HumanReadableIdentifier;
	path: string;
	version: string;
	kind: 'required' | 'optional';
};

export type RuntimeDependencyReport = RuntimeDependency & {
	met: boolean;
};

export type PluginDependenciesResponse = {
	report: RuntimeDependencyReport[];
};

export type PluginJsonResponse = {
	data?: unknown;

	/** @default none */
	render: 'none' | 'table' | 'string';
};

export type PluginProxyResponse = void | PluginJsonResponse;

/** @default none */
export type PluginResponseEncoding = 'none' | 'json' | 'application/json';

export type SanitizedArgs = {
	_: NonEmptyString[];
	projectDir: SanitizedPath;
	maxConcurrency: number;
	debug: boolean;
	disableState: boolean;
	logPluginRequests: boolean;
	fromVsCode: boolean;
	version: boolean;
	build: boolean;
	help: boolean;
	yes: boolean;
	plugin: NonEmptyString;
	env: NonEmptyString;
	quickstart: NonEmptyString;
	setBuild: NonEmptyString;
	setVersion: NonEmptyString;
};

export type PluginActionName =
	| 'proxy'
	| 'pluginInfo'
	| 'checkRuntimeDependencies'
	| 'installRuntimeDependencies'
	| 'proxyTemplate';

export type RequestArgs = SanitizedArgs & {
	taqRun: PluginActionName;
	// TODO: JSON.parse if string
	config: LoadedConfig;
};

export type ProxyTaskArgs = RequestArgs & {
	task: NonEmptyString;
};

export type ProxyTemplateArgs = RequestArgs & {
	template: NonEmptyString;
};

// ---- Hash Types ----

/** @pattern ^P[A-Za-z0-9]{50}$ this is a valid hash for an economical protocol*/
export type EconomicalProtocolHash = string;

/** @pattern ^tz1[A-Za-z0-9]{33}$ */
export type PublicKeyHash = string;

/** @pattern ^[A-Fa-f0-9]{64}$ */
export type SHA256 = string;

// ---- Contract Objects ----

export type Contract = {
	sourceFile: NonEmptyString;
	hash: SHA256;
};

export type Faucet = {
	pkh: PublicKeyHash;
	mnemonic: string[];
	/** @format email */
	email: string;
	password: string;
	/** @pattern ^\d+$ */
	amount: string;
	activation_code: string;
};

// ---- External ----

/** Port number for postgresql container
 * @default 5432
 */
type TzKtConfigPostgresqlPort = number;

/** Port number for TzKt API
 * @default 5000
 */
type TzKtConfigApiPort = number;

export type TzKtConfig = {
	/** Do not start TzKt when sandbox starts */
	disableAutostartWithSandbox?: boolean;
	postgresqlPort?: TzKtConfigPostgresqlPort;
	apiPort?: TzKtConfigApiPort;
};

// ---- Project Files ----

export type Environment = {
	/**
	 * @minLength 1 Must reference the name of an existing network configuration
	 */
	networks: NonEmptyString[];
	/**
	 * @minLength 1 Must reference the name of an existing sandbox configuration
	 */
	sandboxes: NonEmptyString[];
	storage?: Record<string, NonEmptyString>;
	aliases?: Record<string, Record<string, NonEmptyString>>;
};

export type EphemeralState = {
	build: string;
	configHash: string;

	// Note: these were changed from a union(either type) to intersection(both types): i.e. InstalledPlugin | Task is not correct

	/** Task/Plugin Mapping */
	tasks: Record<string, InstalledPlugin & Task>;
	/** Operation/Plugin Mapping */
	operations: Record<string, InstalledPlugin & ParsedOperation>;
	/** Templates/Plugin Mapping */
	templates: Record<string, InstalledPlugin & ParsedTemplate>;

	plugins: PluginInfo[];
};

export type PersistentState = {
	operations: Record<string, PersistedOperation>;
	tasks: Record<string, PersistedTask>;
};

export type PersistedTask = {
	task: Verb;
	plugin: NonEmptyString;
	time: Timestamp;
	output?: unknown;
};

export type PersistedOperation = {
	hash: SHA256;
	time: Timestamp;
	output?: unknown;
};

/**
 * @minLength 1
 * @pattern ^[A-Za-z0-9]+[A-Za-z0-9-_]+\.[A-Za-z0-9]+[A-Za-z0-9-_]+\.[A-Za-z0-9]+[A-Za-z0-9-_]+$
 */
export type ProvisionerID = string;

export type Provisioner = {
	id: ProvisionerID;
	plugin: NonEmptyString;
	operation: NonEmptyString | 'custom';
	command?: string;
	label?: string;
	depends_on?: ProvisionerID[];
};

export type Provisions = Provisioner[];

// ---- Project Files: Config ----

/** @minLength 1 Default environment must reference the name of an existing environment.*/
type EnvironmentName = NonEmptyString;

/** @default en */
type HumanLanguage = 'en' | 'fr';

/**
 * @default contracts
 * @minLength 1
 */
export type ConfigContractsDir = string;

/**
 * @default artifacts
 * @minLength 1
 */
export type ConfigArtifactsDir = string;

export type Config = {
	language?: HumanLanguage;
	plugins?: InstalledPlugin[];
	contractsDir?: ConfigContractsDir;
	artifactsDir?: ConfigArtifactsDir;
	network?: Record<string, NetworkConfig>;
	sandbox?: Record<string, SandboxConfig>;

	// TODO: This causes a type conflict and is not supported
	// accounts?: {
	// 	default: EnvironmentName;
	// } & Record<string, Environment>;
	environment?: Record<string, Environment | EnvironmentName>;
	accounts?: Record<string, Tz>;
	contracts?: Record<string, Contract>;
	metadata?: MetadataConfig;
};

// TODO: sandbox breaks ts-to-zod
export type LoadedConfig = Config & {
	projectDir: SanitizedAbsPath;
	configFile: SanitizedAbsPath;
	hash: SHA256;
};

export type MetadataConfig = {
	name?: string;
	projectDescription?: string;
	authors?: string[];
	license?: string;
	homepage?: string;
};

export type NetworkConfig = {
	label: HumanReadableIdentifier;
	rpcUrl: Url;
	protocol: EconomicalProtocolHash;
	accounts?: Record<string, Record<string, unknown>>;
	faucet?: Faucet;
};

export type SandboxAccountConfig = {
	encryptedKey: NonEmptyString;
	publicKeyHash: PublicKeyHash;
	secretKey: NonEmptyString;
};

export type SandboxConfig = {
	label: NonEmptyString;
	rpcUrl: Url;
	protocol: EconomicalProtocolHash;
	attributes?: string | number | boolean;
	plugin?: Verb;

	// TODO: This causes a type conflict and is not supported
	// accounts?: {
	// 	default: NonEmptyString;
	// } & Record<string, SandboxAccountConfig>;
	accounts?: Record<string, SandboxAccountConfig | NonEmptyString>;

	tzkt?: TzKtConfig;
};

export type ScaffoldConfig = {
	postInit?: string;
};

export type ParsedConfig = Omit<Config, 'sandbox'> & {
	sandbox: Record<string, SandboxConfig | NonEmptyString>;
};