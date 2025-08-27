#!/bin/bash

awslocal sqs create-queue --queue-name mail.fifo --attributes FifoQueue=true
