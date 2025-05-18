import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

const directory = "~/Downloads/";

// Expand the tilde to the home directory
const expandedDirectory = directory.replace(/^~/, os.homedir());

// Constants for age thresholds (in milliseconds)
const SECONDS_IN_DAY = 24 * 60 * 60 * 1000;

const OLD_DURATION = 30 * SECONDS_IN_DAY;
const OLD_OLD_DURATION = 180 * SECONDS_IN_DAY;

// Create .old and .old-old directories if they don't exist
const oldDir = path.join(expandedDirectory, ".old");
const oldOldDir = path.join(expandedDirectory, ".old-old");

async function ensureDirectoryExists(dir: string): Promise<void> {
  try {
    await fs.access(dir);
  } catch {
    // Directory doesn't exist
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Get a unique destination path by appending a suffix like " (N)" if needed
async function getUniqueDestinationPath(
  basePath: string,
  fileName: string,
): Promise<string> {
  const fileExt = path.extname(fileName);
  const fileNameWithoutExt = path.basename(fileName, fileExt);
  let destination = path.join(basePath, fileName);
  let counter = 1;

  // Check if the destination already exists
  while (true) {
    try {
      await fs.access(destination);
      // File exists, try with a new suffix
      const newFileName = `${fileNameWithoutExt} (${counter})${fileExt}`;
      destination = path.join(basePath, newFileName);
      counter++;
    } catch {
      // File doesn't exist, we can use this destination
      break;
    }
  }

  return destination;
}

// Move file or directory to target directory
async function moveToDirectory(
  source: string,
  targetDir: string,
  dryRun: boolean = false,
): Promise<void> {
  const fileName = path.basename(source);
  const destination = await getUniqueDestinationPath(targetDir, fileName);

  if (dryRun) {
    console.log(`[DRY RUN] Would move: ${source} -> ${destination}`);
  } else {
    await fs.rename(source, destination);
    console.log(`Moved: ${source} -> ${destination}`);
  }
}

// Generic function to process a directory and move old files
async function processDirectory(options: {
  sourceDir: string;
  targetDir: string;
  ageThreshold: number;
  directoriesToSkip?: string[];
  dryRun?: boolean;
}): Promise<void> {
  // Ensure directoriesToSkip has a default value if not provided
  if (!options.directoriesToSkip) {
    options.directoriesToSkip = [];
  }
  await ensureDirectoryExists(options.targetDir);

  try {
    await fs.access(options.sourceDir);
  } catch {
    // Source directory doesn't exist, nothing to process
    console.log(`Source directory doesn't exist: ${options.sourceDir}`);
    return;
  }

  const now = new Date().getTime();
  const items = await fs.readdir(options.sourceDir);

  for (const item of items) {
    // Skip directories in the skip list
    if (options.directoriesToSkip.includes(item)) continue;

    const itemPath = path.join(options.sourceDir, item);
    const stats = await fs.stat(itemPath);
    const itemAge = now - stats.mtime.getTime();

    // If older than the threshold, move to target directory
    if (itemAge > options.ageThreshold) {
      await moveToDirectory(itemPath, options.targetDir, options.dryRun);
    }
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    // By default, do a dry run. Only actually move files if --run flag is passed
    const dryRun = !args.includes("--run");

    if (dryRun) {
      console.log(
        `Starting archive process in DRY RUN mode (default) for: ${expandedDirectory}`,
      );
      console.log(`No files will be moved, only reporting what would happen.`);
      console.log(`Use --run flag to actually move files.`);
    } else {
      console.log(
        `Starting archive process with ACTUAL FILE MOVES for: ${expandedDirectory}`,
      );
      console.log(`Files will be moved as specified.`);
    }

    // First process the .old directory to move old files to .old-old
    await processDirectory({
      sourceDir: oldDir,
      targetDir: oldOldDir,
      ageThreshold: OLD_OLD_DURATION,
      directoriesToSkip: [".old-old"],
      dryRun,
    });

    // Then process the main directory to move files to .old
    await processDirectory({
      sourceDir: expandedDirectory,
      targetDir: oldDir,
      ageThreshold: OLD_DURATION,
      directoriesToSkip: [".old", ".old-old"],
      dryRun,
    });

    if (dryRun) {
      console.log("Dry run completed successfully. No files were moved.");
      console.log("Use --run flag to actually move files.");
    } else {
      console.log(
        "Archive process completed successfully. Files were moved as specified.",
      );
    }
  } catch (error) {
    console.error("Error during archive process:", error);
  }
}

// Run the main function
await main();
