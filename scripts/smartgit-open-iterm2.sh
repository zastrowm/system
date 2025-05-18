#!/bin/bash
# Sourced from https://gist.github.com/vuchau/e977bc1934984e8e859b8ddd8ddd3b38

/usr/bin/osascript - $1 2>/dev/null << EOF
on run argv
	set newpath to (do shell script "echo $PATH")
    set path_cd to ""
    repeat with n from 1 to count of argv
      set path_cd to path_cd & item n of argv & ASCII character (92)  & " "
    end repeat
    set path_cd to text 1 thru -3 of path_cd
    tell application "iTerm"
	activate
        if (count of windows) is 0 then
            if (count of windows) is 1 then
                set newTab to (current tab of first window)
            else
                set newTab to (current tab of (create window with default profile))
            end if
        else
            set newTab to (create tab with default profile) of first window
        end if
        
        # Wait for the shell prompt to be ready
        tell current session of newTab
            set maxWaitTime to 10 # Maximum time to wait in seconds
            set waitInterval to 0.1 # Check every half second
            set elapsedTime to 0
            
            repeat
                delay waitInterval
                set elapsedTime to elapsedTime + waitInterval
                
                # Check if the session is at shell prompt
                if is at shell prompt then
                    write text "cd " & path_cd
                    write text "clear"
                    exit repeat
                end if
                
                # Exit if we've waited too long
                if elapsedTime > maxWaitTime then
                    log "Timed out waiting for shell prompt"
                    exit repeat
                end if
            end repeat
        end tell
    end tell
end run
EOF