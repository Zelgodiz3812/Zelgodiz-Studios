param (
    [Parameter(Mandatory=$true)]
    [string]$pathToAdd
)

# Get the current path
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'Machine')

# Add the new path
$newPath = $currentPath + ';' + $pathToAdd

# Set the new path
[Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')