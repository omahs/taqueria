#!/usr/bin/env bash
skip_npm_ci="$SKIP_NPM_CI"

if [ "$0" == "./bin/build-all.sh" ] && [ -f index.ts ]; then
    echo '**********************************************'
    echo '******* BUILDING ALL TAQUERIA PACKAGES *******'
    echo '**********************************************'

    echo ""
    echo '**********************************************'
    echo "** Checking Dependencies"
    (
        set -e
        docker ps > /dev/null
        echo "✅ Docker is installed, running, and the user has permission."
    )
    errorCode=$?
    if [ $errorCode -ne 0 ]; then
        echo "❌ Docker is not installed, not running, or the user needs permission."
        exit $errorCode
    fi
    if [ -n `which deno || ""` ]; then
        echo "Deno installed!"
        VERSION=$(deno --version | awk '/deno/{print $2}' | awk -F. '{print $1"."$2}')
        MAJOR_VERSION=$(echo $VERSION | cut -d. -f1)
        MINOR_VERSION=$(echo $VERSION | cut -d. -f2)

        if [ "$MAJOR_VERSION" -lt "1" ] || [ "$MAJOR_VERSION" -eq "1" -a "$MINOR_VERSION" -lt "34" ]; then
            echo "❌ Deno is installed, but the version is less than v1.34. Please use Deno v1.34 or greater."
            exit 1
        else
           echo "✅ Deno is installed, and running v1.34.x or greater"
        fi
    else
        echo "❌ Deno is not installed."
        exit -2
    fi

    echo "** Dependency checks passed"

    set -e # exiting on error

    if [ -z "$skip_npm_ci" ]; then 
        echo ""
        echo '**********************************************'
        echo "** Installing NPM dependencies"
        npm ci
    fi

    echo ""
    echo '**********************************************'
    echo "** Generating Types"
    npm run build-types

    echo ""
    echo '**********************************************'
    echo "** Building taqueria"
    npm run build:binary

    echo ""
    echo '**********************************************'
    echo "** Building packages"
    npm run build:packages

    echo ""
    echo '**********************************************'
    echo "** Builds complete!"

else
    echo "Usage: ./bin/build-all.sh"
    echo "(please run from within project root)"
fi
