param (
    [Parameter(Mandatory=$true)]
    [string]$pathToAdd,
    [Parameter(Mandatory=$true)]
    [string]$scriptPath
)

powershell -Command "(Get-Content $scriptPath) -replace 'PLEASE_REPLACE_THIS', '$pathToAdd' | Set-Content $scriptPath"

$distros = (wsl -l -q).Trim() -split "`n" | ForEach-Object { $_ -replace '[^a-zA-Z0-9\._-]', '' } | Where-Object { $_ -ne '' }

foreach ($distro in $distros) {
    try {
        $username = (wsl -d $distro -e whoami).Trim()
        $homeDirectory = (wsl -d $distro -e bash -c "cd ~ && pwd").Trim()
        $destinationPath = "\\wsl$\$distro$homeDirectory\.cursor-server"
        if (Test-Path $destinationPath) {
            Remove-Item -Force -Recurse -Path $destinationPath
        }
        New-Item -ItemType Directory -Path $destinationPath
        Write-Host "Distro: '$distro'"
        Write-Host "Destination Path: $destinationPath"
        $content = Get-Content -Path $scriptPath -Encoding UTF8
        $content | Out-File -FilePath $destinationPath -Encoding UTF8

        # Note: Now specifying the distribution with -d $distro
        wsl -d $distro --exec bash -c "tr -d '\r' < ~/.cursor-server/server-env-setup > ~/.cursor-server/server-env-setup.tmp && mv ~/.cursor-server/server-env-setup.tmp ~/.cursor-server/server-env-setup"
    } catch {
        Write-Host "Error processing distro: '$distro'. Error details: $_" -ForegroundColor Red
    }
}
