# ordir

## Organize your directories with the CLI.

Invoke the CLI in a directory you think could benefit from a consistent structure. _ordir_ automatically does this for you - it organizes documents, images, videos, executables, etc., by moving them into separate, relevant directories.

### Installation

```
npm install -g ordir
```

Installing ordir globally gives you access to the CLI from anywhere within your file system, and you can directly invoke the command within a directory like so:

```
ordir --yes
```

Alternatively, you can skip installation and use npx in the required directory to directly execute the CLI.

```
npx ordir --yes
```

### Usage

Using the command without any flag opts you in for the questionnaire where you'll be asked a bunch of questions about your preferences for the names of directories your files will be subsequently moved into.

```
ordir
```

If you think you are going to be okay with the default names for the directories, use a -y or --yes flag to skip the questionnaire.

```
ordir -y
```

If you wish to override default behavior of the CLI for what types of files should be moved into their own directories, and what files shouldn't, you can use a [--target | -t] or [--exclude | -e] flag, followed by a list of file extensions.

```
ordir -t .txt .css
```

```
ordir -e .pdf
```

By default, using a target or an exclude flag won't opt you out of the questionnaire. To retain the option to override what files to move, and bypass the questionnaire, you can chain flags as shown:

```
ordir -yt .mp4 .jpeg
```

```
ordir -ey .rar .zip .exe
```

#### Target specific files and place them in a directory of your choice:

When you specify a -t flag to target files, the files try to find one of the available default directories. But by specifying the name of a directory at the end of the file-list, you can override this behavior.

```
ordir -t .js .html .css Dev
```

This is the command you'd have to use to place all .js, .html, .css files in a directory called Dev. It's as simple as that.

### Exclude specific files and place the other files in a directory of your choice:

In order to exclude a certain group of files and move all the other files into a common directory, you'd do the following:

```
ordir -e .js Docs
```

The above command moves all files other than JavaScript to a directory called Docs.

#### Get help

At any point, you can use -h or --help to show help in the terminal.

```
ordir -h
```
